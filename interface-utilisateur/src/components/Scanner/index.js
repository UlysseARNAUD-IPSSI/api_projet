import styles from  './index.module.css';
import {useEffect, useState} from 'react';

function Scanner(props) {

  const {config,trans} = props;

  useEffect(() => {
    return () => {}
  }, []);

  return <>
    <div className={styles.scanner} />
  </>;
}

export default Scanner;
