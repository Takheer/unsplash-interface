'use client'
import styles from './styles.module.scss'
import api, {UnsplashImage} from "@/services/apiProvider";
import {useState} from "react";
import Image from "next/image";

type ImagesMetadata = {
  total: number
  downloaded: number
}

export default function Home() {
  const [text, setText] = useState('');
  const [unsplashImages, setUnsplashImages] = useState([] as UnsplashImage[]);
  const [metadata, setMetadata] = useState({} as ImagesMetadata);
  const [currentPage, setCurrentPage] = useState(1)
  const [fullImageSrc, setFullImageSrc] = useState('');
  const [isModalShown, setIsModalShown] = useState(false);
  const [isNoResults, setIsNoResults] = useState(false);

  const handleClick = async (query: string) => {
    const result = await api.retrieveImages(query);
    if (result.images.length) {
      setUnsplashImages(result.images);
      setMetadata({
        total: result.total,
        downloaded: result.imgsPerPage,
      })
      setCurrentPage(2);
      setIsNoResults(false);
    } else {
      setIsNoResults(true);
    }
  }

  const handlePagination = async () => {
    const result = await api.retrieveImages(text, currentPage);
    setUnsplashImages(prevState => [...prevState, ...result.images]);
    setMetadata(prevState => ({
      ...prevState,
      downloaded: result.imgsPerPage * result.currentPage,
    }))
    setCurrentPage(result.currentPage! + 1);
  }
  const handleClear = () => setText('');
  const handleModalClose = () => {
    setFullImageSrc('')
    setIsModalShown(false)
  }
  const showFullImage = (src: string) => {
    setFullImageSrc(src)
    setIsModalShown(true)
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between px-4 md:px-8`}>
      <div className='flex flex-col items-center w-full'>
        <div className={`${styles.searchRow} ${styles.responsiveContainer} flex flex-row items-center w-full ${unsplashImages.length || isNoResults ? 'pt-8 justify-start' : 'pt-48 justify-center'}`}>
          <div className={`${styles.inputContainer} flex flex-row justify-center items-center text-black h-12 border-radius-12`}>
            <Image
              alt={'Найти'}
              src={'/icons/search.svg'}
              width={24}
              height={24}
            ></Image>
            <input
            className={styles.input}
              type='text'
              placeholder='Телефоны, яблоки, груши...'
              value={text}
              onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            />
            {text.length ?
              <Image
                alt={'Очистить'}
                src={'/icons/close.svg'}
                style={{cursor: "pointer"}}
                width={24}
                height={24}
                onClick={handleClear}
              ></Image> :
              <></>
            }
          </div>
          <button className={`${styles.button} flex flex-row justify-center items-center`} onClick={() => handleClick(text)}>
            Искать
          </button>
        </div>
        {isNoResults ?
        (<p className={`${styles.placeholder} ${styles.responsiveContainer} flex flex-row items-center w-full`}>
          К сожалению, поиск не дал результатов
        </p>) :
        <div className={`${styles.results} flex flex-row gap-2 justify-center items-center flex-wrap py-4`}>
          {unsplashImages.map((img: UnsplashImage) => (
            <Image
              key={img.id}
              className={styles.resultImg}
              src={img.small}
              alt={img.alt}
              width={200}
              height={200}
              onClick={() => showFullImage(img.fullLink)}
            />))}
        </div>}
        {metadata.total > metadata.downloaded ? <button onClick={handlePagination}>Загрузить ещё</button> : null}

      </div>
      {isModalShown ? (
      <div className={`${styles.modalBackground} flex justify-center items-center`}>
        <Image
          className='fixed left-1/2 top-1/2 z-10 animate-spin'
          src={'/icons/spinner.svg'} alt={''}
          width={48}
          height={48}
        />
        <Image
          src={'/icons/closeModal.svg'}
          alt='Закрыть'
          width={24}
          height={24}
          className={`absolute right-2 top-2 cursor-pointer z-30`}
          onClick={handleModalClose}
        />
        <Image src={fullImageSrc} alt={''} width={760} height={760} className={'z-20'}/>
      </div>
      ) : null}
      
    </main>
  );
}
