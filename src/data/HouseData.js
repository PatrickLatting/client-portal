const images = require.context("../assets/houseimages", false, /\.(png|jpe?g|svg)$/);

const houseData = [
    {
        id: 1,
        name: "House 1",
        description: "This is a beautiful house with a big front door.",
        price: 1000000,
        status: "Available",
        tags: [],
    },
    {
        id: 2,
        name: "House 2",
        description: "A modern house with sleek design.",
        price: 1200000,
        status: "Sold",
        tags: ["Modern", "Luxury"],
    },
    {
        id: 3,
        name: "House 3",
        description: "A cozy house with a beautiful garden.",
        price: 900000,
        status: "Available",
    },
].map((house) => ({ //add images and house status tag to each house
    ...house,
    tags: [...house.tags, house.status],
    image: images(`./${house.id}.png`),
}));

export default houseData;