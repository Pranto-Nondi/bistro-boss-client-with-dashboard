import { useRef } from "react";


const AddItem = () => {
    const imgRate = useRef(null);


    const image_Hosting_Key = `c9424a6b11cef2275cc2eda6d094e045`

    const url = `https://api.imgbb.com/1/upload?key=${image_Hosting_Key}`
    const handelSubmit = (e) => {

        e.preventDefault()

        const image = imgRate.current.files[0]

        console.log(image);


        const datas = new FormData();
        console.log(datas);
        datas.append('image', image)

        // console.log(datas);


        fetch(url, {
            method: "POST",
            body: datas
        })

            .then(res => res.json())
            .then(image => {
                console.log(image);
                if (image.success) {
                    const img = image.data.display_url

                    const { name, price, category, recipe } = image

                    const newItem = { name, price, category, recipe, image: img }
                    console.log(newItem);
                }
            })

    }

    return (
        <>
            <form onSubmit={handelSubmit}>

                <input ref={imgRate} type="file" />
                <input type="submit" className="btn btn-primary" />
            </form>

        </>
    );
};

export default AddItem;



// const img = image.data.display_url

// const { name, price, category, recipe } = data

// const newItem = { name, price, category, recipe, image: img }
// console.log(newItem);