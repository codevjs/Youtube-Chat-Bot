// sleep functions
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// functions random milisecond
const randomizator = (a, b ) => {
    return Math.floor(Math.random() * b ) + a;
};

const paginate = (array, page_size, page_number) => {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
};

module.exports = {
    sleep,
    randomizator,
    paginate
};
