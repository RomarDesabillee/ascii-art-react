import { useEffect, useRef, useState } from 'react';

type Image = {
    file: any,
    error: string,
    tag?: HTMLImageElement
}

const App: React.FC = () => {

    const [image, setImage] = useState<Image | null>(null)

    const canvas = useRef<any>(null)

    useEffect((): void => {
        if (image?.tag && canvas) {
            const txt = "@#$%?*+;:,."
            const dim = 4
            const w = 500 //width and height
            const counter = 400
            const ctx: any = canvas.current.getContext('2d')
            ctx.fillStyle = "white"
            ctx.drawImage(image?.tag, 0, 0, w, w)

            let ascii: string[][] = []
            for (let i = 0; i < counter; i++) {
                let asciiChars: string[] = []
                for (let j = 0; j < counter; j++) {
                    let x = i * dim
                    let y = j * dim + 8
                    let color = 0
                    let pixel = ctx.getImageData(x, y, dim, dim).data;
                    for (let k = 0; k < pixel.length; k += 4) {
                        let r = pixel[k]
                        let g = pixel[k + 1]
                        let b = pixel[k + 2]
                        let alpha = pixel[k + 3]
                        let brightness = Math.floor((r + g + b + alpha) / 4)
                        color += brightness
                    }
                    // console.log(color/pixel.length)
                    color = color / pixel.length
                    let ch: string = txt.charAt(Math.floor(color % txt.length))
                    asciiChars.push(ch)
                    // ctx.fillStyle = 'red'
                    // ctx.fillText(ch, x, y)
                }
                ascii.push(asciiChars)
            }
            // hide image
            ctx.fillRect(0, 0, w, w)
            for (let i = 0; i < counter; i++) {
                for (let j = 0; j < counter; j++) {
                    let x = i * dim
                    let y = j * dim + 8
                    ctx.fillStyle = 'red'
                    ctx.fillText(ascii[i][j], x, y)
                }
            }
        }
    }, [canvas, image])


    const fileOnChange = (e: any): void => {
        const acceptedFileTypes: string[] = ['jpg', 'jpeg', 'png']
        try {
            const file: any = e.target.files[0]
            if (file) {
                const img = file.name.split('.').reverse()[0]
                if (!acceptedFileTypes.includes(img)) {
                    setImage({ file: '', error: 'Invalid File Type' })
                } else {
                    const img = new Image()
                    img.src = URL.createObjectURL(file)
                    // img.src.style.filter = "invert(100%)"
                    img.onload = () => setImage({
                        tag: img, file: URL.createObjectURL(file), error: ''
                    })
                }
            }
        } finally {
            setImage({ file: '', error: 'Invalid File Type' })
        }
    }

    return (
        <>
            <div>
                <span>Select Image: </span>
                <input type="file" name="image" onChange={fileOnChange} />
                {image?.file === '' && (
                    <div style={{ color: "red" }}>{image?.error}</div>
                )}
            </div>
            <canvas ref={canvas} width={500} height={500} />
            <div>
                {image?.file && (
                    <img src={image?.file} width={200} height={200} alt="output img" />
                )}
            </div>
        </>
    );
}

export default App;
