import { PropsWithChildren } from 'react';

export const MainLayout = (props: PropsWithChildren) => {
  return (
    <>
      <div className="fixed left-0 top-0 -z-10 h-full w-full">
        <div className="relative h-full w-full dark:bg-black">
          {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_.5px,transparent_1px),linear-gradient(to_bottom,#8080800a_.5px,transparent_.5px)] bg-[size:14px_24px]"></div> */}
          <div className="hidden dark:block absolute left-0 right-0 top-0 h-[1200px] w-[900px] rounded-full bg-[radial-gradient(circle_400px_at_50%_400px,#fbfbfb45,#000)]"></div>
          {/* <div className="absolute left-0 right-0 top-0 h-[1200px] w-[400px] rounded-full bg-[radial-gradient(circle_250px_at_50%_300px,#fbfbfb45,#000)]"></div> */}
        </div>
      </div>

      <main className="relative h-screen px-6 pt-4 pb-8">{props.children}</main>
    </>
  );
};
