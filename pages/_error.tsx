import Error from 'next/error';

function PlayError(props) {
  const { statusCode } = props;
  return <Error statusCode={statusCode} />;
}

PlayError.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;

  return { statusCode };
};

export default PlayError;
