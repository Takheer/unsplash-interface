'use client'
import styles from './styles.module.scss'
import api, {UnsplashImage} from "@/services/apiProvider";
import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {throttle} from "@/services/utils";

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
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const handleClick = async (query: string) => {
    if (!text) return;

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
      downloaded: result.imgsPerPage * currentPage,
    }))
    setCurrentPage(currentPage + 1);
  }

  const handleClear = () => setText('');

  const handleModalClose = () => {
    setFullImageSrc('')
    setIsModalShown(false)
    document.body.classList.remove('overflow-hidden');
  }

  const showFullImage = (src: string) => {
    setFullImageSrc(src)
    setIsModalShown(true)
    document.body.classList.add('overflow-hidden');
  }

  const debouncedSet = useMemo(() => throttle(() => setIsFetchingMore(true), 1000), []);

  const scrollHandler = async (e: any) => {
    if(e.target.documentElement.scrollHeight - e.target.documentElement.scrollTop - window.innerHeight < 50)
    {
      debouncedSet();
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    }
  },[])

  useEffect(() => {
    if (isFetchingMore && metadata.total > metadata.downloaded) {
      setIsFetchingMore(false);
      handlePagination();
    }
  }, [isFetchingMore]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between px-4 md:px-8`}>
      <div className='flex flex-col items-center w-full'>
        <div className={`${styles.searchRow} ${styles.responsiveContainer} flex flex-row items-center w-full pb-4 ${unsplashImages.length || isNoResults ? 'pt-2.5 md:pt-12 justify-start sticky top-0 z-20 bg-white' : 'pt-48 justify-center'}`}>
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
              onKeyPress={(e) => e.key == 'Enter' ? handleClick(text) : null}
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
        <div className={`${styles.results} flex flex-row gap-2 justify-center items-center flex-wrap pt-4`}>
          {unsplashImages.map((img: UnsplashImage, i: number) => (
            <Image
              key={`${i}-${img.id}`}
              className={`${styles.resultImg} cursor-pointer `}
              src={img.small}
              alt={img.alt}
              width={200}
              height={200}
              onClick={() => showFullImage(img.fullLink)}
            />))}
        </div>}
      </div>
      {isModalShown ? (
      <div className={`${styles.modalBackground} flex justify-center items-start md:items-center z-20`}>
        <Image
          src={'/icons/closeModal.svg'}
          alt='Закрыть'
          width={32}
          height={32}
          className={`absolute right-5 top-5 cursor-pointer z-40`}
          onClick={handleModalClose}
        />
        <Image src={fullImageSrc} alt={''} width={760} height={760} className={'z-20'}/>
      </div>
      ) : null}
      
    </main>
  );
}
