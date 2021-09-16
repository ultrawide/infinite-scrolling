import React from 'react';

class ScrollComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            loading: false,
            page: 0,
            prevY: 0
        }
    }

    getPhotos(page) {
        this.setState({ loading: true });
        fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`)
            .then(res => res.json())
            .then(data => {
                this.setState({ photos: [...this.state.photos, ...data] });
                this.setState({ loading: false });
            });
    }

    componentDidMount() {
        this.getPhotos(this.state.page);

        var options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };

        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            options
        );

        this.observer.observe(this.loadingRef);
    }

    handleObserver(entities) {
        const y = entities[0].boundingClientRect.y;
        if (this.state.prevY > y) {
            const lastPhoto = this.state.photos[this.state.photos.length - 1];
            const curPage = lastPhoto.albumId;
            this.getPhotos(curPage);
            this.setState({ page: curPage });
        }
        this.setState({ prevY: y });
    }

    render() {
        // To change the loading icon behavior
        const loadingTextCSS = { display: this.state.loading ? "block" : "none" };
        const loadingCSS = {
            height: "100px",
            margin: "30px"
        };

        return (
            <div className="container">
                <div style={{ minHeight: "800px" }}>
                    {this.state.photos.map(user => (
                        <img src={user.url} height="100px" width="200px" />
                    ))}
                </div>
                <div
                    ref={loadingRef => (this.loadingRef = loadingRef)}
                    style={loadingCSS}
                >
                    <span style={loadingTextCSS}>Loading...</span>
                </div>
            </div>
        );
    }
}

export default ScrollComponent;