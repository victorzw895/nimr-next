import type { StorybookConfig } from "@storybook/nextjs";
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-styling",
    "storybook-react-context",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    if (!config.resolve) return config;
    config.resolve.plugins = [new TsconfigPathsPlugin({ extensions: config.resolve.extensions })]
    return config
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
