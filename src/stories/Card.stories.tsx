import type { Meta, StoryObj } from '@storybook/nextjs';
import AppDecorator from 'decorator/AppDecorator';
// import { AppContext } from '@/context/AppContext';
// import { withReactContext } from 'storybook-react-context'
import Card from '@/components/Card';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Card> = {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    id: {
      type: {
        name: 'number',
        required: true,
      },
      description: 'Anime Id',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
      },
      control: {
        type: 'number',
      },
    },
    japName: {
      type: {
        name: 'string',
        required: false,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Japanese Name' },
      },
      control: {
        type: 'text',
      },
    },
    engName: {
      type: {
        name: 'string',
        required: false,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'English Name' },
      },
      control: {
        type: 'text',
      },
    },
    poster: {
      type: {
        name: 'string',
        required: false,
      },
      table: {
        type: { summary: 'string: image url' },
        defaultValue: { summary: 'https://placehold.co/45x64' },
      },
      control: {
        type: 'text',
      },
    },
    selectAnime: {
      action: 'clicked',
      table: {
        category: 'Events',
      },
    },
    rank: {
      type: {
        name: 'number',
        required: false,
      },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
      },
      control: {
        type: 'number',
      },
    },
    stars: {
      type: {
        name: 'number',
        required: false,
      },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
      },
      control: {
        type: 'number',
      },
    },
  },
  decorators: [
    AppDecorator,
    // withReactContext({ // Breaking change with Storybook 7 for storybook-react-context
    //   Context: AppContext,
    //   initialState: {
    //     seasonYears: [2000]
    //   },
    // }),
  ],
  args: {
    id: 0,
    japName: 'Anime Japanese Name',
    engName: 'Anime English Name',
    poster: 'https://placehold.co/45x64',
    rank: 1,
    stars: 1,
  }
};

export default meta;
type Story = StoryObj<typeof Card>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    rank: null,
    stars: null,
  },
};

export const RankedCard: Story = {
  args: {
    rank: 20,
    stars: 5,
  },
};
