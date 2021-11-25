import { useEffect, useRef, useState } from 'react';

type Image = {
    file: any,
    error: string,
    html?: HTMLImageElement
}

const App: React.FC = () => {

    const [image, setImage] = useState<Image | null>(null)

    const canvas = useRef<any>(null)

    useEffect((): void => {
        draw()
    }, [canvas, image])

    const draw = (): void => {
        if (image?.html && canvas) {
            const txt: string = "@#$%?*+;:,."
            const dim: number = 4
            const w: number = 500 //width and hight
            const counter: number = 400
            const ctx: any = canvas.current.getContext('2d')
            ctx.fillStyle = "white"
            ctx.drawImage(image?.html, 0, 0, w, w)

            let ascii: string[][] = new Array
            for (let i: number = 0; i < counter; i++) {
                let asciiChars: string[] = new Array
                for (let j: number = 0; j < counter; j++) {
                    let x: number = i * dim
                    let y: number = j * dim + 8
                    let color: number = 0
                    let pixel = ctx.getImageData(x, y, dim, dim).data;
                    for (let k: number = 0; k < pixel.length; k += 4) {
                        let r: number = pixel[k]
                        let g: number = pixel[k + 1]
                        let b: number = pixel[k + 2]
                        let alpha: number = pixel[k + 3]
                        let brightness: number = Math.floor((r + g + b + alpha) / 4)
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
    }

    const fileOnChange = (e: any): void => {
        const acceptedFileTypes: string[] = ['jpg', 'jpeg', 'png']
        const file: any = e.target.files[0]
        try {
            if (file) {
                const img = file.name.split('.').reverse()[0]
                if (!acceptedFileTypes.includes(img)) {
                    setImage({ file: '', error: 'Invalid File Type' })
                } else {
                    const img = new Image()
                    img.src = URL.createObjectURL(file)
                    img.onload = () => setImage({
                        html: img, file: URL.createObjectURL(file), error: ''
                    })
                }
            }
        } catch {
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
                <img src={image?.file} width={200} height={200} />
            </div>
        </>
    );
}

export default App;
