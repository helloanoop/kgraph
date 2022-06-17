import Head from 'next/head';
import IndexPage from 'pageComponents/Index';
import GlobalStyle from '../globalStyles';

const Home = () => {
  return (
    <div>
      <Head>
        <title>kgraph</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalStyle />

      <main>
        <IndexPage />
      </main>
    </div>
  );
};

export default Home;
