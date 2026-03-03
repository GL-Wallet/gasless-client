import { useWalletStore } from '@/entities/wallet'
import { useAuthStore } from '@/kernel/auth'
import { cloudStorageService } from '@/kernel/cloud-storage/service'
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard'
import { decrypt } from '@/shared/lib/crypto-js'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import {
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  Copy,
  Database,
  KeyRound,
  Loader2,
  ScrollText,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type LogLevel = 'info' | 'warn' | 'error' | 'success'

interface LogEntry {
  time: string
  level: LogLevel
  message: string
}

interface CheckItem {
  label: string
  status: 'ok' | 'fail' | 'warn'
  detail?: string
}

interface DecryptedWallet {
  name: string
  address: string
  mnemonic: string | null
  error: string | null
}

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

export function CloudStorageDebugPage() {
  const [data, setData] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedKeys, setExpandedKeys] = useState(() => new Set<string>())
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showLogs, setShowLogs] = useState(false)
  const { copy, isCopied } = useCopyToClipboard()

  const { passcode, hashedPasscode } = useAuthStore()
  const addresses = useWalletStore(s => s.addresses)
  const activeIndex = useWalletStore(s => s.activeIndex)

  const logsEndRef = useRef<HTMLDivElement>(null)

  const log = useCallback((level: LogLevel, message: string) => {
    setLogs(prev => [...prev, { time: now(), level, message }])
  }, [])

  // --- Load cloud storage with logging ---
  useEffect(() => {
    log('info', 'Starting cloud storage read...')

    cloudStorageService
      .getAll()
      .then((result) => {
        const keys = Object.keys(result)
        log('success', `Cloud storage loaded: ${keys.length} key(s) found`)
        keys.forEach(k =>
          log('info', `  Key: "${k}" (${result[k].length} chars)`),
        )
        setData(result)
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e)
        log('error', `Cloud storage read failed: ${msg}`)
        setData({})
      })
      .finally(() => setLoading(false))
  }, [log])

  // --- Decrypt wallets with logging ---
  const decryptedWallets = useMemo<DecryptedWallet[]>(() => {
    if (!addresses.length) {
      log('warn', 'No wallets in store to decrypt')
      return []
    }
    if (!passcode) {
      log('error', 'Passcode not available in auth store — cannot decrypt')
      return []
    }

    log('info', `Attempting decryption for ${addresses.length} wallet(s)...`)

    return addresses.map((wallet, i) => {
      const label = wallet.name || `Wallet ${i + 1}`

      if (!wallet.encryptedMnemonic) {
        log('error', `[${label}] encryptedMnemonic field is missing/empty`)
        return {
          name: label,
          address: wallet.address,
          mnemonic: null,
          error: 'encryptedMnemonic is empty',
        }
      }

      log(
        'info',
        `[${label}] encryptedMnemonic present (${wallet.encryptedMnemonic.length} chars)`,
      )

      try {
        const mnemonic = decrypt(wallet.encryptedMnemonic, passcode)
        if (mnemonic) {
          const wordCount = mnemonic.trim().split(/\s+/).length
          log('success', `[${label}] Decrypted OK — ${wordCount} words`)
          return {
            name: label,
            address: wallet.address,
            mnemonic,
            error: null,
          }
        }
        else {
          log('error', `[${label}] decrypt() returned empty string`)
          return {
            name: label,
            address: wallet.address,
            mnemonic: null,
            error: 'Decryption returned empty result',
          }
        }
      }
      catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        log('error', `[${label}] decrypt() threw: ${msg}`)
        return {
          name: label,
          address: wallet.address,
          mnemonic: null,
          error: msg,
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passcode, addresses])

  // --- Diagnostic checklist ---
  const checks = useMemo<CheckItem[]>(() => {
    const items: CheckItem[] = []

    // 1. Passcode in auth store
    items.push(
      passcode
        ? { label: 'Passcode in memory', status: 'ok' }
        : {
            label: 'Passcode in memory',
            status: 'fail',
            detail:
              'Auth store has no passcode — authentication may have failed',
          },
    )

    // 2. Hashed passcode in auth store
    items.push(
      hashedPasscode
        ? { label: 'Passcode hash loaded', status: 'ok' }
        : {
            label: 'Passcode hash loaded',
            status: 'fail',
            detail: 'hashedPasscode is null in auth store',
          },
    )

    // 3. Cloud storage readable
    if (data === null) {
      items.push({
        label: 'Cloud storage readable',
        status: 'fail',
        detail: 'getAll() returned null',
      })
    }
    else {
      items.push({
        label: 'Cloud storage readable',
        status: 'ok',
        detail: `${Object.keys(data).length} keys`,
      })
    }

    // 4. passcode-storage key exists
    const passcodeRaw = data?.['passcode-storage']
    items.push(
      passcodeRaw
        ? {
            label: 'passcode-storage key',
            status: 'ok',
            detail: `${passcodeRaw.length} chars`,
          }
        : {
            label: 'passcode-storage key',
            status: 'fail',
            detail: 'Key missing from cloud storage',
          },
    )

    // 5. wallet-storage key exists
    const walletRaw = data?.['wallet-storage']
    items.push(
      walletRaw
        ? {
            label: 'wallet-storage key',
            status: 'ok',
            detail: `${walletRaw.length} chars`,
          }
        : {
            label: 'wallet-storage key',
            status: 'fail',
            detail: 'Key missing from cloud storage',
          },
    )

    // 6. Wallet store has addresses
    items.push(
      addresses.length > 0
        ? {
            label: 'Wallets in store',
            status: 'ok',
            detail: `${addresses.length} wallet(s), active: #${activeIndex}`,
          }
        : {
            label: 'Wallets in store',
            status: 'fail',
            detail: 'No wallets loaded in zustand store',
          },
    )

    // 7. Active wallet has encryptedMnemonic
    const activeWallet = addresses[activeIndex]
    if (activeWallet) {
      items.push(
        activeWallet.encryptedMnemonic
          ? {
              label: 'Active wallet encryptedMnemonic',
              status: 'ok',
              detail: `${activeWallet.encryptedMnemonic.length} chars`,
            }
          : {
              label: 'Active wallet encryptedMnemonic',
              status: 'fail',
              detail: 'Field is empty or missing',
            },
      )
    }
    else {
      items.push({
        label: 'Active wallet encryptedMnemonic',
        status: 'fail',
        detail: 'No active wallet',
      })
    }

    // 8. Decryption result
    const activeDecrypted = decryptedWallets[activeIndex]
    if (activeDecrypted) {
      items.push(
        activeDecrypted.mnemonic
          ? {
              label: 'Mnemonic decryption',
              status: 'ok',
              detail: `${activeDecrypted.mnemonic.trim().split(/\s+/).length} words`,
            }
          : {
              label: 'Mnemonic decryption',
              status: 'fail',
              detail: activeDecrypted.error ?? 'Unknown error',
            },
      )
    }
    else if (addresses.length > 0) {
      items.push({
        label: 'Mnemonic decryption',
        status: 'fail',
        detail: 'No decryption result for active wallet',
      })
    }

    // 9. settings-storage
    const settingsRaw = data?.['settings-storage']
    items.push(
      settingsRaw
        ? { label: 'settings-storage key', status: 'ok' }
        : {
            label: 'settings-storage key',
            status: 'warn',
            detail: 'Key missing — defaults will be used',
          },
    )

    return items
  }, [
    passcode,
    hashedPasscode,
    data,
    addresses,
    activeIndex,
    decryptedWallets,
  ])

  // --- Scroll logs to bottom ---
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs, showLogs])

  const toggleKey = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key))
        next.delete(key)
      else next.add(key)
      return next
    })
  }

  const formatValue = (raw: string): string => {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2)
    }
    catch {
      return raw
    }
  }

  const copyAll = () => {
    if (data) {
      const formatted: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(data)) {
        try {
          formatted[k] = JSON.parse(v)
        }
        catch {
          formatted[k] = v
        }
      }
      copy(JSON.stringify(formatted, null, 2))
    }
  }

  const copyLogs = () => {
    const text = logs
      .map(l => `[${l.time}] ${l.level.toUpperCase()}: ${l.message}`)
      .join('\n')
    copy(text)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const entries = Object.entries(data ?? {})
  const failCount = checks.filter(c => c.status === 'fail').length

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <PageHeader
        title="Cloud Storage Debug"
        description={
          failCount > 0 ? `${failCount} issue(s) detected` : 'All checks passed'
        }
      />

      {/* Diagnostic Checklist */}
      <div className="border rounded-md overflow-hidden">
        <div className="px-4 py-3 border-b bg-secondary/30">
          <h3 className="text-sm font-semibold">Diagnostic Checklist</h3>
        </div>
        <div className="divide-y">
          {checks.map(check => (
            <div
              key={check.label}
              className="flex items-start space-x-3 px-4 py-2.5"
            >
              {check.status === 'ok' && (
                <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-green-500" />
              )}
              {check.status === 'fail' && (
                <XCircle className="size-4 shrink-0 mt-0.5 text-destructive" />
              )}
              {check.status === 'warn' && (
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-yellow-500" />
              )}
              <div className="min-w-0">
                <span className="text-sm">{check.label}</span>
                {check.detail && (
                  <p className="text-xs text-muted-foreground truncate">
                    {check.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="border rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setShowLogs(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30"
        >
          <div className="flex items-center space-x-2">
            <ScrollText className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold">
              Logs (
              {logs.length}
              )
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {showLogs ? 'Hide' : 'Show'}
          </span>
        </button>
        {showLogs && (
          <div className="border-t">
            <div className="max-h-[250px] overflow-auto p-3 space-y-1 bg-black/5 dark:bg-white/5">
              {logs.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-2 text-xs font-mono"
                >
                  <span className="shrink-0 text-muted-foreground">
                    {entry.time}
                  </span>
                  <span
                    className={
                      entry.level === 'error'
                        ? 'text-destructive'
                        : entry.level === 'warn'
                          ? 'text-yellow-500'
                          : entry.level === 'success'
                            ? 'text-green-500'
                            : 'text-muted-foreground'
                    }
                  >
                    {entry.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
            <div className="border-t px-3 py-2">
              <Button
                onClick={copyLogs}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <Copy className="size-3 mr-2" />
                Copy Logs
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Decrypted Mnemonics */}
      {decryptedWallets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Decrypted Seed Phrases
          </h3>
          {decryptedWallets.map(wallet => (
            <div
              key={wallet.address}
              className="border border-destructive/30 rounded-md p-4 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <KeyRound className="size-4 shrink-0 text-destructive" />
                <span className="text-sm font-medium">{wallet.name}</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {wallet.address}
              </p>
              {wallet.mnemonic
                ? (
                    <>
                      <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-secondary/50 rounded p-3">
                        {wallet.mnemonic}
                      </pre>
                      <Button
                        onClick={() => copy(wallet.mnemonic!)}
                        variant="ghost"
                        size="sm"
                        className="w-full"
                      >
                        <Copy className="size-3 mr-2" />
                        Copy Seed Phrase
                      </Button>
                    </>
                  )
                : (
                    <p className="text-xs text-destructive">
                      Failed to decrypt:
                      {' '}
                      {wallet.error}
                    </p>
                  )}
            </div>
          ))}
        </div>
      )}

      {/* Raw Cloud Storage */}
      <Button onClick={copyAll} variant="outline" className="w-full">
        {isCopied
          ? (
              <CheckCheck className="size-4 mr-2" />
            )
          : (
              <Copy className="size-4 mr-2" />
            )}
        Copy All Raw Data
      </Button>

      {entries.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No data in cloud storage</p>
        </div>
      )}

      <div className="space-y-2 pb-4">
        {entries.map(([key, value]) => (
          <div key={key} className="border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => toggleKey(key)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left"
            >
              <Database className="size-4 shrink-0 text-muted-foreground" />
              <span className="font-mono text-sm font-medium truncate">
                {key}
              </span>
            </button>

            {expandedKeys.has(key) && (
              <div className="border-t px-4 py-3 space-y-2">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all text-muted-foreground bg-secondary/50 rounded p-3 max-h-[400px] overflow-auto">
                  {formatValue(value)}
                </pre>
                <Button
                  onClick={() => copy(formatValue(value))}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <Copy className="size-3 mr-2" />
                  Copy Value
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
