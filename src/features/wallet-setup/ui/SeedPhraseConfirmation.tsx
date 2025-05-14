import type { PropsWithClassname } from '@/shared/types/react'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

import ShinyButton from '@/shared/magicui/shiny-button'
import { isEqual } from '@/shared/utils/isEqual'
import { shuffle } from '@/shared/utils/shuffle'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

import { generateUniqueRandomNumbers } from '../helpers/generateUniqueRandomNumbers'

export function SeedPhraseConfirmation({ className, seedPhrase }: PropsWithClassname<{ seedPhrase: string[] }>) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isPrevWordCorrect, setIsPrevWordCorrect] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { t } = useTranslation()

  const [isSuccess, setIsSuccess] = useState(false)

  // Generate unique random numbers and correct words based on those numbers
  const randomNumbers = useMemo(() => generateUniqueRandomNumbers(3, 0, seedPhrase.length - 1), [seedPhrase])

  const correctWords = useMemo(() => randomNumbers.map(number => seedPhrase[number]), [randomNumbers, seedPhrase])

  // Shuffle the seed phrase for display
  const shuffledSeedPhrase = useMemo(() => shuffle(seedPhrase), [seedPhrase])

  // Determine if a word is selected or correct
  const isSelectedWord = useCallback((word: string) => selectedWords.includes(word), [selectedWords])
  const isCorrectWord = useCallback((word: string, index: number) => correctWords[index] === word, [correctWords])

  useEffect(() => {
    const lastSelectedWord = selectedWords[selectedWords.length - 1]
    const lastSelectedIndex = selectedWords.length - 1
    setIsPrevWordCorrect(isCorrectWord(lastSelectedWord, lastSelectedIndex))
  }, [selectedWords, isCorrectWord])

  useEffect(() => {
    if (isEqual(correctWords, selectedWords)) {
      setIsButtonDisabled(false)
      setIsSuccess(true)
    }
  }, [correctWords, selectedWords])

  const handleWordClick = useCallback(
    (word: string) => {
      if (selectedWords.length < 3 && !isSelectedWord(word) && (isPrevWordCorrect || selectedWords.length === 0)) {
        setSelectedWords(prev => [...prev, word])
      }
      else {
        !isSuccess && setSelectedWords(prev => [...prev.slice(0, -1), word])
      }
    },
    [selectedWords.length, isSelectedWord, isPrevWordCorrect, isSuccess],
  )

  const handleCellClick = useCallback(
    (index: number, word: string) => {
      if (!isCorrectWord(word, index) && !isSuccess) {
        setSelectedWords(prev => prev.filter(selected => selected !== word))
      }
    },
    [isCorrectWord, isSuccess],
  )

  const handleButtonClick = () => {
    navigate(ROUTES.WALLET_CREATION_SUCCESS)
  }

  return (
    <div className={cn('grow flex flex-col justify-between space-y-3', className)}>
      <div className="grow flex flex-col space-y-3">
        <div className="grid grid-cols-3 gap-x-4">
          {randomNumbers.map((number, idx) => (
            <div
              onClick={() => handleCellClick(idx, selectedWords[idx] || '')}
              className={cn('text-center border px-2 py-3 rounded-md', {
                'border-green-700': isCorrectWord(selectedWords[idx] || '', idx),
                'border-red-900': selectedWords[idx] && !isCorrectWord(selectedWords[idx], idx),
                'border-dashed':
                  (selectedWords.length === 0 && idx === 0) || (selectedWords.length === idx && isPrevWordCorrect),
              })}
              key={idx}
            >
              {selectedWords[idx] || number + 1}
            </div>
          ))}
        </div>

        <div className="grow flex items-center">
          <div className="relative flex flex-wrap gap-2 justify-center h-fit">
            {shuffledSeedPhrase.map((word, idx) => (
              <div
                onClick={() => handleWordClick(word)}
                className={cn(
                  'text-base flex items-center justify-center rounded-md border dark:border-neutral-700 dark:bg-secondary/20 px-1 h-12 flex-shrink-0 min-w-[30%] max-w-fit whitespace-nowrap',
                  {
                    'border-transparent': isSelectedWord(word),
                    'cursor-pointer': !isSelectedWord(word),
                    'cursor-not-allowed': isSelectedWord(word),
                  },
                )}
                key={idx}
              >
                {!isSelectedWord(word) && word}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShinyButton
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        animate={false}
        text={t('wallet.setup.confirmSeedPhrase.button')}
      />
    </div>
  )
}
