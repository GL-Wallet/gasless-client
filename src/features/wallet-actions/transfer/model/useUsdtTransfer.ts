import type { TransactionID } from '@/kernel/tron/model/types'
import { useUser } from '@/entities/user'

import { getPrivateKeyFromPasscode, useWallet } from '@/entities/wallet'
import { api } from '@/kernel/api'
import { tronService } from '@/kernel/tron'
import { isAxiosError } from 'axios'
import { useCallback } from 'react'

interface TransferTrc20Props {
  recipientAddress: string
  depositAddress: string
  transferAmount: number
  transactionFee: number
  userPasscode: string
  optimization: boolean
}

/**
 * Outcome of a USDT transfer attempt.
 *
 * The distinction between `rejected` and `indeterminate` is critical: an
 * `indeterminate` result means the relay request was dispatched but we never
 * got a server response, so the backend MAY already have broadcast the
 * transaction on-chain. Retrying it (e.g. with the standard fee) would
 * double-send and double-debit the user. Only `rejected` is safe to retry.
 */
export type TransferOutcome =
  | { status: 'success', txid: TransactionID }
  | { status: 'rejected', error: unknown }
  | { status: 'indeterminate', error: unknown }

export function useTrc20Transfer() {
  const user = useUser()
  const wallet = useWallet()

  const transferUsdt = useCallback(
    async ({
      recipientAddress,
      depositAddress,
      transferAmount,
      transactionFee,
      userPasscode,
      optimization,
    }: TransferTrc20Props): Promise<TransferOutcome> => {
      if (!user)
        return { status: 'rejected', error: new Error('User is not loaded') }

      // Becomes true once we dispatch a broadcast (direct on-chain send or the
      // relay POST). Used to decide whether a thrown error might have left a
      // transaction broadcast on the network.
      let submitted = false

      try {
        const privateKey = getPrivateKeyFromPasscode(
          wallet.encryptedMnemonic,
          userPasscode,
        )
        const accountEnergy = await tronService.getAccountEnergy(
          wallet.address,
          privateKey,
        )

        const requiredEnergy
          = await api.getEnergyRequirementsByAddress(recipientAddress)

        if (accountEnergy >= requiredEnergy - 10 || !optimization) {
          submitted = true
          const txid = await tronService.sendUsdt(
            recipientAddress,
            transferAmount,
            privateKey,
          )
          return { status: 'success', txid }
        }

        const signedUsdtTransaction
          = await tronService.createAndSignTrc20Transaction(
            recipientAddress,
            transferAmount,
            privateKey,
          )
        const signedTrxTransaction
          = await tronService.createAndSignTrxTransaction(
            depositAddress,
            transactionFee,
            privateKey,
          )

        if (!signedUsdtTransaction || !signedTrxTransaction) {
          return {
            status: 'rejected',
            error: new Error('Failed to sign transfer transactions'),
          }
        }

        submitted = true
        const { txid } = await api.transfer(user.id, {
          signedTrxTransaction,
          signedUsdtTransaction,
        })
        return { status: 'success', txid }
      }
      catch (error) {
        console.error('Error transferring TRC-20 token:', error)

        // Nothing was dispatched yet (passcode / signing / validation failure),
        // so nothing could have been broadcast — safe to surface as rejected.
        if (!submitted)
          return { status: 'rejected', error }

        // A broadcast/relay was already dispatched, so the transaction MAY be
        // on-chain. We may only report `rejected` (which lets the caller
        // auto-retry) when we have positive proof it was never broadcast.
        const httpStatus = isAxiosError(error)
          ? error.response?.status
          : undefined

        // 409 Conflict = the relay already has this exact transfer in flight or
        // already submitted on-chain (it dedups on transfer intent, not txID).
        // It is NOT a failure and must NOT be resent: the standard-fee retry
        // broadcasts directly on-chain, bypassing that server-side dedup, so a
        // resend here would double-debit. Report indeterminate — the caller
        // shows "processing" and the user verifies on-chain instead of retrying.
        if (httpStatus === 409)
          return { status: 'indeterminate', error }

        // Any other 4xx = the server refused a bad request (fee / validation /
        // undecodable tx) BEFORE broadcasting, so nothing is on-chain and it is
        // safe to let the caller retry with the standard fee. Everything else —
        // 5xx (energy failure / on-chain revert / unexpected: outcome UNKNOWN),
        // gateway 502/504, connection timeout / no response, or a post-broadcast
        // error thrown by TronWeb's direct send (a plain Error, not an
        // AxiosError) — is indeterminate: the transfer may be on-chain, so
        // retrying could double-send and double-debit the user.
        const serverRefusedBeforeBroadcast
          = httpStatus !== undefined && httpStatus >= 400 && httpStatus < 500

        return serverRefusedBeforeBroadcast
          ? { status: 'rejected', error }
          : { status: 'indeterminate', error }
      }
    },
    [wallet.address, wallet.encryptedMnemonic, user],
  )

  return {
    transferUsdt,
  }
}
