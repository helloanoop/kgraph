import Head from 'next/head';
import Sidebar from 'components/Sidebar';
import AllPages from 'pageComponents/AllPages';
import GlobalStyle from '../globalStyles';

const AllPagesView = () => {
  const leftSidebarOpen =true;

  return (
    <div className="container flex root">
      <Head>
        <title>kgraph</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalStyle />
      <div className={`${leftSidebarOpen ? 'flex slide' : 'hidden'} nb-sidebar-container`}>
        <Sidebar/>
      </div>
      <div className="w-full">
        {/* <Navbar/> */}

        <main className="flex flex-grow flex-col notebase-app px-4 pt-10">
          <AllPages />
        </main>
      </div>
    </div>
  );
};

export default AllPagesView;
