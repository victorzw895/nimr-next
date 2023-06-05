import { AppProvider } from '@/context/AppContext';
import { Decorator } from '@storybook/react';
import React, { useState } from 'react';


const AppDecorator: Decorator = (Story, context) => {
  const [state, setState] = useState([2000]);

  const value = { seasonYears: state }

  return (
    <AppProvider value={value}>
      <Story />
    </AppProvider>
  )
}

export default AppDecorator;