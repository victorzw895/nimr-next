# Stories

This directory contains Storybook stories for component development and documentation.

## Overview

Storybook provides an isolated environment for developing and documenting UI components.

## Story Files

### Component Stories
- `Button.stories.ts` - Generic button component stories
- `Card.stories.tsx` - Anime card component stories
- `Header.stories.ts` - Header component stories
- `List.stories.tsx` - List component stories
- `Page.stories.ts` - Full page layout stories
- `Preview.stories.tsx` - Anime preview component stories

### Supporting Files
- `fakeData.ts` - Mock data for stories
- `Introduction.mdx` - Storybook introduction
- Component files (`Button.tsx`, `Header.tsx`, `Page.tsx`)
- Styling files (`button.css`, `header.css`, `page.css`)
- `assets/` - SVG icons for stories

## Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

Storybook runs on [http://localhost:6006](http://localhost:6006) by default.

## Usage

Stories follow the Component Story Format (CSF):

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```

## State Management Integration

Stories can be wrapped with different state management providers:

```typescript
// React Context
export const WithContext = {
  decorators: [
    (Story) => (
      <AppProvider value={{ seasonYears: [2023] }}>
        <Story />
      </AppProvider>
    ),
  ],
};

// XState Machine
export const WithXState = {
  decorators: [
    (Story) => (
      <PreviewProvider>
        <Story />
      </PreviewProvider>
    ),
  ],
};
