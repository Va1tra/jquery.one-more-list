function DumbStorage() {
    this.prev = () => {
        return new Promise((resolve, reject) => {
            reject('error.no-more-data');
        });
    }
}

export default DumbStorage;