import Head from 'next/head';
import Sidebar from 'components/Sidebar';
import Page from 'pageComponents/Page';
import GlobalStyle from '../../globalStyles';

const PageView = () => {
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
        <main className="flex flex-grow flex-col notebase-app px-4" style={{marginTop: '2rem'}}>
          <Page />
        </main>
      </div>
    </div>
  );
};

export default PageView;
