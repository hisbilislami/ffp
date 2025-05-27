export type AppModuleMenu = {
  icon: string;
  label: string;
  path: string;
  pages: AppPageMenu[];
};

export type AppPageMenu = {
  label: string;
  path: string;
  icon: string;
  pages?: AppPageMenu[];
};
