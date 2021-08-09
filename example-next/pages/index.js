import {useState, useEffect} from 'react'
import styles from '../styles/Home.module.css'
import {Fetcher, useData} from 'ra-fetch'

export default function Home({data}) {
    const [image, setImage] = useState()

    const [posts] = useData(data.data).index('posts')

    console.log(posts)

    // useEffect(() => {
    //     Fetcher.api('placeholder').index('posts').then(response => {
    //         console.log(response)
    //     })
    // }, [])
    // console.log(image)
    return (
        <div className={styles.container}>
            <button onClick={() => {
                Fetcher.api('sanctum').store('categories', {
                    name: 'test',
                    image
                }).then(response => console.log(response))
            }}>store</button>

            <input type="file" onChange={event => {
                setImage(event.target.files[0])
            }}/>
        </div>
    )
}

Home.getInitialProps = async () => {
    const data = await Fetcher.api('placeholder').index('posts')

    return {
        data: data,
    }
}
