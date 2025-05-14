import type { SetStateAction } from 'react'
import type { Passcode } from '../model/types'
import { cn } from '@/shared/lib/utils'
import { Delete, Fingerprint } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { NUMBERS, PASSCODE_LENGTH } from '../constants'

interface Props {
  passcode?: Passcode
  isBiometryEnabled?: boolean
  setPasscode: (passcode: SetStateAction<Passcode>) => void
  handleBiometry?: () => void
}

export function PasscodePad({ passcode, isBiometryEnabled, setPasscode, handleBiometry }: Props) {
  const [enteredDigits, setEnteredDigits] = useState<number[]>([])

  const handleNumberClick = (n: number) => {
    if (enteredDigits.length < PASSCODE_LENGTH) {
      setEnteredDigits(prev => [...prev, n])

      if (enteredDigits.length === PASSCODE_LENGTH - 1) {
        setPasscode([...enteredDigits, n].join(''))
      }
    }
  }

  const handleDeleteClick = useCallback(() => {
    setEnteredDigits(prev => prev.slice(0, -1))
  }, [])

  useEffect(() => {
    if (passcode) {
      setEnteredDigits(Array.from(passcode, Number))
    }
    else if (passcode === null) {
      setEnteredDigits([])
    }
  }, [passcode])

  return (
    <div className="flex flex-col items-center w-full space-y-10">
      {/* Passcode Display */}
      <div className="flex gap-4">
        {Array.from({ length: PASSCODE_LENGTH }).map((_, idx) => (
          <div
            key={idx}
            className={cn('select-none h-4 w-4 rounded-full', {
              'bg-neutral-200 dark:bg-secondary': idx >= enteredDigits.length,
              'bg-neutral-400 dark:bg-gray-300': idx < enteredDigits.length,
            })}
          />
        ))}
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4">
        {NUMBERS.map(number => (
          <div
            key={number}
            onClick={() => handleNumberClick(number)}
            className={cn(
              'select-none active:bg-secondary transition-colors duration-300 text-xl flex justify-center items-center border dark:border-neutral-700 rounded-full h-20 w-20',
              { 'col-start-2': number === 0 },
            )}
          >
            {number}
          </div>
        ))}

        {isBiometryEnabled && (
          <div
            onClick={handleBiometry}
            className="select-none active:bg-secondary transition-colors duration-100 col-start-1 row-end-5 text-xl flex justify-center items-center rounded-full h-20 w-20"
          >
            <Fingerprint className="size-8" />
          </div>
        )}

        <div
          onClick={handleDeleteClick}
          className="select-none active:bg-secondary transition-colors duration-100 col-start-3 row-end-5 text-xl flex justify-center items-center rounded-full h-20 w-20"
        >
          <Delete className="size-6" />
        </div>
      </div>
    </div>
  )
}
