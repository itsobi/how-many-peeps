'use client';

import { AnimatePresence, motion } from 'motion/react';

import { ChevronDown, ChevronUp, UserMinus, UserPlus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../ui/button';

export function Counter() {
  const [groupSize, setGroupSize] = useState(0);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleDecrementGroup = useCallback(() => {
    setIsButtonClicked(true);
    setGroupSize((prev) => Math.max(0, prev - 1));
  }, []);

  const handleIncrementGroup = useCallback(() => {
    setIsButtonClicked(true);
    setGroupSize((prev) => prev + 1);
  }, []);

  const handleSaveGroupSize = () => {
    setIsButtonClicked(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center w-[300px]">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 bg-rose-500 rounded-full animate-pulse" />
        <p className="text-sm">LIVE COUNT</p>
      </div>

      <h2 className="text-9xl font-semibold">50</h2>

      {/* Badge */}
      {/* <div className="flex items-center gap-2 px-4 py-1 text-sm">
        <span className="h-2.5 w-2.5 bg-amber-400 rounded-full animate-pulse" />
        <span className="text-amber-400">Busy</span>
      </div> */}

      {/* Controls */}
      <div className="flex flex-col w-full gap-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <p>Group size:</p>
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer hover:bg-accent rounded-md p-1"
              onClick={handleDecrementGroup}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="w-4 text-center">{groupSize}</span>
            <button
              className="cursor-pointer hover:bg-accent rounded-md p-1"
              onClick={handleIncrementGroup}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Confirm button */}
        <AnimatePresence mode="popLayout">
          {isButtonClicked && groupSize > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              key="save-button"
            >
              <Button
                onClick={handleSaveGroupSize}
                variant="secondary"
                className="w-full"
              >
                Save Group Size
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-5 mt-2"
        >
          <div className="flex items-center justify-between gap-4">
            <button
              disabled={groupSize === 0}
              className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
            >
              <UserMinus className="w-6 h-6" />
              Exit
            </button>
            <button className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground">
              <UserPlus className="w-6 h-6" />
              Enter
            </button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              disabled={groupSize === 0}
              className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
            >
              <span className="text-lg">-{groupSize}</span>
              <span>Group Exit</span>
            </button>
            <button
              disabled={groupSize === 0}
              className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
            >
              <span className="text-lg">+{groupSize}</span>
              <span>Group Enter</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
