'use client';

import { AnimatePresence, motion } from 'motion/react';

import { Preloaded, usePreloadedQuery } from 'convex/react';

import { ChevronDown, ChevronUp, UserMinus, UserPlus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

interface Props {
  preloadedCrowdCount: Preloaded<typeof api.crowdCounts.getCrowdCount>;
  preloadedGroupSize: Preloaded<typeof api.crowdCounts.getGroupSize>;
}

export function Counter({ preloadedCrowdCount, preloadedGroupSize }: Props) {
  const { orgId } = useAuth();
  const crowdCount = usePreloadedQuery(preloadedCrowdCount);
  const groupSize = usePreloadedQuery(preloadedGroupSize);
  const [groupSizeState, setGroupSizeState] = useState<number | null>(
    groupSize
  );
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [updateCrowdCountIsPending, startCrowdCountTransition] =
    useTransition();
  const [updateGroupSizeIsPending, startGroupSizeTransition] = useTransition();

  const updateOrgCrowdCount = useMutation(api.crowdCounts.updateCrowdCount);
  const updateGroupSize = useMutation(api.crowdCounts.updateGroupSize);

  const handleUpdateCrowdCount = (count: number) => {
    if (!orgId) {
      toast.error('Unable to update crowd count, please try again.');
      return;
    }
    startCrowdCountTransition(async () => {
      const response = await updateOrgCrowdCount({
        externalOrgId: orgId,
        count,
      });
      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  const handleDecrementGroup = () => {
    if (groupSizeState === null || groupSizeState === undefined) {
      toast.error('Unable to update group size, please try again.');
      return;
    }
    setIsButtonClicked(true);
    setGroupSizeState((prev) => Math.max(0, (prev ?? 0) - 1));
  };

  const handleIncrementGroup = () => {
    if (groupSizeState === null || groupSizeState === undefined) {
      toast.error('Unable to update group size, please try again.');
      return;
    }
    if (groupSizeState === 25) {
      toast.error('Group size cannot be greater than 25');
      return;
    }
    setIsButtonClicked(true);
    setGroupSizeState((prev) => (prev ?? 0) + 1);
  };

  const handleSaveGroupSize = () => {
    if (!orgId) {
      toast.error('Unable to update group size, please try again.');
      return;
    }
    startGroupSizeTransition(async () => {
      const response = await updateGroupSize({
        externalOrgId: orgId,
        groupSize: groupSizeState ?? 0,
      });
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
    setIsButtonClicked(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center w-[300px]">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 bg-rose-500 rounded-full animate-pulse" />
        <p className="text-sm">LIVE COUNT</p>
      </div>

      <h2 className="text-9xl font-semibold">{crowdCount?.count ?? 0}</h2>

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
            <span className="w-4 text-center">{groupSizeState}</span>
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
          {isButtonClicked && (groupSizeState ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              key="save-button"
            >
              <Button
                onClick={handleSaveGroupSize}
                disabled={updateGroupSizeIsPending}
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
              onClick={() => {
                if (!crowdCount || crowdCount.count === 0) {
                  return;
                }
                handleUpdateCrowdCount(crowdCount.count - 1);
              }}
              disabled={
                !crowdCount ||
                crowdCount.count === 0 ||
                updateCrowdCountIsPending
              }
              className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
            >
              <UserMinus className="w-6 h-6" />
              Exit
            </button>
            <button
              onClick={() =>
                handleUpdateCrowdCount((crowdCount?.count ?? 0) + 1)
              }
              disabled={updateCrowdCountIsPending}
              className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
            >
              <UserPlus className="w-6 h-6" />
              Enter
            </button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() =>
                handleUpdateCrowdCount(
                  (crowdCount?.count ?? 0) - (groupSize ?? 0)
                )
              }
              disabled={
                groupSize === 0 ||
                (groupSize ?? 0) > (crowdCount?.count ?? 0) ||
                updateCrowdCountIsPending
              }
              className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
            >
              <span className="text-lg">-{groupSize}</span>
              <span>Group Exit</span>
            </button>
            <button
              onClick={() =>
                handleUpdateCrowdCount(
                  (crowdCount?.count ?? 0) + (groupSize ?? 0)
                )
              }
              disabled={updateCrowdCountIsPending}
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
