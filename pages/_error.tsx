import Error from 'next/error';

function PlayError(props) {
  const { statusCode } = props;
  return <Error statusCode={statusCode} />;
}

PlayError.getInitialProps = ({ res, err, query }) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;

  // eslint-disable-next-line no-underscore-dangle
  if (!query.__NEXT_PAGE) {
    // eslint-disable-next-line no-console
    console.info('query - %o', query);
  }

  return { statusCode };
};

export default PlayError;
