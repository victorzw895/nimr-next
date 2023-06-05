import { AnimeListProvider } from '@/context/AnimeListContext';
import { Anime } from '@/types/Anime';
import { Decorator } from '@storybook/react';
import React, { useState } from 'react';

const AnimeListDecorator: Decorator = (Story, context) => {

  return (
    <AnimeListProvider>
      <Story />
    </AnimeListProvider>
  )
}

export default AnimeListDecorator;