import { PropsWithChildren } from 'react';

export const MainLayout = (props: PropsWithChildren) => {
  return (
    <>
      <div className="fixed left-0 top-0 -z-10 h-full w-full">
        <div className="relative h-full w-full dark:bg-black">
          <div className="hidden dark:block absolute left-0 right-0 top-0 h-[1200px] w-[900px] rounded-full bg-[radial-gradient(circle_400px_at_50%_400px,#fbfbfb45,#000)]"></div>
        </div>
      </div>

      <main className="relative h-screen px-6 pt-4 pb-8">{props.children}</main>
    </>
  );
};
