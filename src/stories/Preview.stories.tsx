import type { Meta, StoryObj } from '@storybook/react';
import AppDecorator from 'decorator/AppDecorator';
import AnimeListDecorator from 'decorator/AnimeListDecorator';
import RankedListDecorator from 'decorator/RankedListDecorator';
import WatchListDecorator from 'decorator/WatchListDecorator';
import PreviewDecorator from 'decorator/PreviewDecorator';
import Preview from '@/components/Preview';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Preview> = {
  title: 'Preview',
  component: Preview,
  tags: ['autodocs'],
  argTypes: {
    // id: {
    //   type: {
    //     name: 'number',
    //     required: true,
    //   },
    //   description: 'Anime Id',
    //   table: {
    //     type: { summary: 'number' },
    //     defaultValue: { summary: 0 },
    //   },
    //   control: {
    //     type: 'number',
    //   },
    // },
    // japName: {
    //   type: {
    //     name: 'string',
    //     required: false,
    //   },
    //   table: {
    //     type: { summary: 'string' },
    //     defaultValue: { summary: 'Japanese Name' },
    //   },
    //   control: {
    //     type: 'text',
    //   },
    // },
    // engName: {
    //   type: {
    //     name: 'string',
    //     required: false,
    //   },
    //   table: {
    //     type: { summary: 'string' },
    //     defaultValue: { summary: 'English Name' },
    //   },
    //   control: {
    //     type: 'text',
    //   },
    // },
    // poster: {
    //   type: {
    //     name: 'string',
    //     required: false,
    //   },
    //   table: {
    //     type: { summary: 'string: image url' },
    //     defaultValue: { summary: 'https://placehold.co/45x64' },
    //   },
    //   control: {
    //     type: 'text',
    //   },
    // },
    // selectAnime: {
    //   action: 'clicked',
    //   table: {
    //     category: 'Events',
    //   },
    // },
    // rank: {
    //   type: {
    //     name: 'number',
    //     required: false,
    //   },
    //   table: {
    //     type: { summary: 'number' },
    //     defaultValue: { summary: 1 },
    //   },
    //   control: {
    //     type: 'number',
    //   },
    // },
    // stars: {
    //   type: {
    //     name: 'number',
    //     required: false,
    //   },
    //   table: {
    //     type: { summary: 'number' },
    //     defaultValue: { summary: 1 },
    //   },
    //   control: {
    //     type: 'number',
    //   },
    // },
    toggleCollapse: {
      action: 'toggleCollapse',
      table: {
        category: 'Events',
      },
    },
  },
  decorators: [AppDecorator, AnimeListDecorator, RankedListDecorator, WatchListDecorator, PreviewDecorator],
  args: {
    // id: 0,
    // japName: 'Anime Japanese Name',
    // engName: 'Anime English Name',
    // poster: 'https://placehold.co/45x64',
    // rank: 1,
    // stars: 1,
  },
  parameters: {
    // actions: { argTypesRegex: '^on.*' },
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Preview>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    // id: 0,
    // japName: 'jap name',
    // engName: 'eng name',
    // poster: 'https://placehold.co/45x64',
    // selectAnime: () => {},
    // rank: 1,
    // stars: 1,
  },
};

export const Large: Story = {
  args: {
    // size: 'large',
    // label: 'Button',
  },
};

export const Small: Story = {
  args: {
    // size: 'small',
    // label: 'Button',
  },
};
