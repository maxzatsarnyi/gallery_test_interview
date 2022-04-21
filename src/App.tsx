import { makeStyles } from '@material-ui/core';
import { Suspense } from 'react';
import { Routes } from './routes/index';

function App() {
  const useStyles = makeStyles(() => ({
    App: {
      minHeight: '100vh',
    },
  }));

  const classes = useStyles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={classes.App}>
        <Routes />
      </div>
    </Suspense>
  );
}

export default App;
