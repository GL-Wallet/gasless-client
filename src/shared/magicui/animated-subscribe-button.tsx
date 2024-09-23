'use client';

import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface AnimatedSubscribeButtonProps extends HTMLMotionProps<'button'> {
  buttonColor: string;
  buttonTextColor?: string;
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
  timeout?: number;
}

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  buttonColor,
  subscribeStatus,
  buttonTextColor,
  changeText,
  initialText,
  className,
  onClick,
  timeout = 1000,
  ...props
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          className={cn(
            'relative flex w-[200px] items-center justify-center overflow-hidden rounded-md bg-white p-[10px] outline outline-1 outline-black',
            className
          )}
          onClick={() => setIsSubscribed(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
        >
          <motion.span
            key="action"
            className="relative block h-full w-full font-semibold"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            style={{ color: buttonColor }}
          >
            {changeText}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          className={cn(
            'relative flex w-[200px] cursor-pointer items-center justify-center rounded-md border-none p-[10px]',
            className
          )}
          style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          onClick={(e) => {
            setIsSubscribed(true);
            
            setTimeout(() => {
              if (onClick) {
                onClick(e);
              }
            }, timeout);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="reaction"
            className="relative block font-semibold"
            initial={{ x: 0 }}
            exit={{ x: 50, transition: { duration: 0.1 } }}
          >
            {initialText}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
