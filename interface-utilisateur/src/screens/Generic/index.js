import styles from './index.module.css';
import {useState, useEffect} from 'react';

function Generic(props) {

  const {config, trans} = props;

  useEffect(() => {
    // on mount
    return () => {
      // on unmount
    }
  });

  return <>
    <section className={styles.section}>
    </section>
  </>;
}

export default Generic;
