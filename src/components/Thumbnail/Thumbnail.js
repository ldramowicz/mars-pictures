import React from "react";
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import './Thumbnail.scss';

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);

      this.state = {
          photoIndex: 0,
          isOpen: false,
      };
  }

  render() {
    console.log("this.props.roverData = " + this.props.roverData);

    let images = this.props.roverPics;
    console.log("images.length = " + images.length);
    let cameras = this.props.roverCameras;
    let roverData = this.props.roverData;
    let viewMode = this.props.currentViewMode

    if (!images)
          return null;

    const { photoIndex, isOpen } = this.state;

    var imgTitle = roverData[0] + ": " + roverData[1] + " [" + (this.state.photoIndex+1) + "/"  + images.length + "]";

    return (
        <div className="Thumbnail">
        {this.props.roverPics.map( (path, index) => {
            return <div key={index} className="roverData" onClick={() => this.setState({ isOpen: true,  photoIndex: index})}>
                        <div className="roverImage" style={{backgroundImage: 'url('+path+')'}}></div>
                    </div>
        })}
            {isOpen && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    imageTitle={imgTitle}
                    imageCaption={cameras[photoIndex]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                        this.setState({
                            photoIndex: (photoIndex + images.length - 1) % images.length,
                        })
                    }
                    onMoveNextRequest={() =>
                        this.setState({
                            photoIndex: (photoIndex + 1) % images.length,
                        })
                    }
                />
            )}

        </div>
    );
  }
}

Thumbnail.propTypes = {
    roverPics: PropTypes.array,
    roverCameras: PropTypes.array,
    roverData: PropTypes.array,
    currentViewMode: PropTypes.number,
}


export default Thumbnail;