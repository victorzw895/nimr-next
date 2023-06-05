import { WatchListProvider } from '@/context/WatchListContext';
import { Anime } from '@/types/Anime';
import { Decorator } from '@storybook/react';
import React, { useState } from 'react';

const WatchListDecorator: Decorator = (Story, context) => {

  return (
    <WatchListProvider>
      <Story />
    </WatchListProvider>
  )
}

export default WatchListDecorator;