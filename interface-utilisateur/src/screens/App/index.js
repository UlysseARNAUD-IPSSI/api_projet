import styles from './index.module.css';
import {useState, useEffect} from 'react';
import Scan from "../Scan";
import Prompt from "../Prompt";
import Explore from "../Explore";
import Check from "../Check";

function App(props) {

  const {config, trans} = props;

  const [scanning, setScanning] = useState(false);
  const [prompting, setPrompting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [exploring, setExploring] = useState(false);

  useEffect(()=>{
    const section = document.querySelector(`[class^="App"] + section`);

    function onClickWindow () {
      if (section) {
        setScanning(false);
        setPrompting(false);
        setChecking(false);
        setExploring(false);
      }
    }
    function onClickSection (event) {
      event.stopPropagation();
    }

    window.addEventListener('click', onClickWindow);
    if(section) section.addEventListener('click', onClickSection);

    return () => {
      window.removeEventListener('click', onClickWindow);
      if(section) section.removeEventListener('click', onClickSection);
    }
  });

  function onClickScanCamera(event) {
    setScanning(true);
  }

  function onClickPrompt(event) {
    setPrompting(true);
  }

  function onClickCheck(event) {
    setChecking(true);
  }

  function onClickExplore(event) {
    setExploring(true);
  }

  return <>
    <section className={styles.section}>

      <aside>
        <button onClick={onClickScanCamera} disabled>{trans('scan.camera')}</button>
      </aside>

      <aside>
        <button onClick={onClickPrompt}>{trans('scan.saisir')}</button>
        <button onClick={onClickCheck} disabled>{trans('scan.historique')}</button>
        <button onClick={onClickExplore}>{trans('scan.explorer')}</button>
      </aside>
    </section>

    {scanning && <Scan config={config} trans={trans} />}
    {prompting && <Prompt config={config} trans={trans.bind(trans)} />}
    {exploring && <Explore config={config} trans={trans} />}
    {checking && <Check config={config} trans={trans} />}
  </>;
}

export default App;
