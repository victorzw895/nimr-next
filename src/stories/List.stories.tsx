import type { Meta, StoryObj } from '@storybook/react';
import PreviewDecorator from 'decorator/PreviewDecorator';
import AppDecorator from 'decorator/AppDecorator';
import List from '@/components/List';
import { generateFakeList } from './fakeData';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof List> = {
  title: 'List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    scrollableTarget: {
      type: {
        name: 'string',
        required: true,
      },
      table: {
        type: { summary: 'Scrollable Element string ID' },
        defaultValue: { summary: 'scrollable-list' },
      },
      control: {
        type: 'text',
      },
    },
    setList: {
      action: 'setList',
      table: {
        category: 'Events',
      },
    },
    loadMore: {
      action: 'loadMore',
      table: {
        category: 'Events',
      },
    },
    updateDb: {
      action: 'updateDb',
      table: {
        category: 'Events',
      },
    }
  },
  decorators: [
    AppDecorator,
    PreviewDecorator,
    (Story) => (
      <div id='scrollable-list' className='list space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
        <Story />
      </div>
    )
  ],
  args: {
    sortable: true,
    showRank: true,
    scrollableTarget: 'scrollable-list',
    list: generateFakeList(),
    // setList: () => {},
    // loadMore: () => {},
    hasMore: false,
    lazyScroll: true,
    // updateDb: () => {},
  }
};

export default meta;
type Story = StoryObj<typeof List>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {};

export const Loading: Story = {
  args: {
    list: [],
    hasMore: true,
  },
};
export const LongList: Story = {
  args: {
    list: generateFakeList(20),
    hasMore: true,
  },
};

