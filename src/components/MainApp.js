import React from "react";
import Thumbnail from './Thumbnail/Thumbnail';
import './MainApp.scss';

const ViewMode = {
    CURIOSITY: 0,
    OPPORTUNITY: 1,
    SPIRIT: 2,
    INIT: 3
};

var defaultView = ViewMode.INIT;

class MainApp extends React.Component {
  constructor() {
    super();
	
	//noinspection JSAnnotator
      this.state = {
          viewMode: defaultView,
          roverNames: ['CURIOSITY','Opportunity','Spirit'],
          roverImages: ['http://www.2oceansvibe.com/wp-content/uploads/2013/04/mars-rover-landing-sequence-landed_57831_600x450.jpg','http://geekshizzle.com/wp-content/uploads/2014/01/Opportunity-Rover-Selfie.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/NASA_Mars_Rover.jpg/300px-NASA_Mars_Rover.jpg'],
          roverData: [],
          roverPictures:[],
          roverCameras:[],
      };
	
    this.handleClick = this.handleClick.bind(this);
    this.renderRoverThumbnails = this.renderRoverThumbnails.bind(this);
  }

  componentDidMount() {

      for (let x = 0; x < this.state.roverNames.length; x++) {

          fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/' + this.state.roverNames[x] + '?api_key=R4Hoi6WcJlos1fgHtge1bZ5dIGqsrURpWVi831Xa') // fetch + API call
              .then(results => results.json())
              .then((data) => {
                      //console.log("Max date for " + this.state.roverNames[x] + " = " + data.photo_manifest.max_date);
                      let tempRoverData = this.state.roverData;
                      tempRoverData.push([data.photo_manifest.name, data.photo_manifest.max_date, this.state.roverImages[x]]);
                      tempRoverData.sort();
                      //console.log("roverData = " + tempRoverData);
                      this.setState({
                          roverData: tempRoverData
                      }, () => {
                          //console.log("DATA = " + data.photo_manifest.max_date);
                          //console.log(this.state.roverData[x][1], this.state.viewMode);
                          fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + this.state.roverNames[x].toLowerCase() + '/photos?earth_date=' + data.photo_manifest.max_date + '&api_key=R4Hoi6WcJlos1fgHtge1bZ5dIGqsrURpWVi831Xa') // fetch + API call
                              .then(results => results.json())
                              .then((data) => {
                                      //console.log("Pics = " + data.photos[0].img_src);
                                      let pictures = data.photos.map((pic) => {
                                          return(pic.img_src)
                                      })
                                      let pics = this.state.roverPictures;
                                      pics[x] = pictures;
                                  //console.log("pictures = " + pictures);

                                      let cameras = data.photos.map((pic) => {
                                          return(pic.camera.full_name)
                                      });
                                        let cams = this.state.roverCameras;
                                        cams[x] = cameras;
                                      //console.log("cameras = " + cameras);

                                      this.setState({
                                          roverPictures: pics,
                                          roverCameras: cams,
                                      }, () => {
                                          //console.log("ROVER pictures = " + x + " " + this.state.roverPictures);
                                      });

                                  }
                              );
                      });
                  }
              )
      }
  }

  
  handleClick(index) {
    //console.log(index); // React Component instance
      this.setState({
          viewMode: index
      });
  }

    renderRoverThumbnails() {
      console.log("Num of pics = " + this.state.roverPictures);
      //console.log("this.state.roverPictures = "+ this.state.viewMode+ "  ===== " + this.state.roverPictures[0]);
        if (this.state.viewMode == 3) {
            return <div className="instructions">Please select a rover to see the latest pictures</div>;
        } else {
            return <Thumbnail roverPics={this.state.roverPictures[this.state.viewMode]}
                              roverCameras={this.state.roverCameras[this.state.viewMode]}
                              roverData={this.state.roverData[this.state.viewMode]}
                              currentViewMode={this.state.viewMode}/>;
        }
    }
  
  render() {
      let roverPics = this.state.roverPictures;
    return (
      <div className="MainApp">
        {this.state.roverData.map( (roverData, index) => {
         return <div key={index} className="roverData" onClick={() => this.handleClick(index)}>
                    <div className="roverImage" style={{backgroundImage: 'url('+roverData[2]+')'}}></div>
                    <div className={"roverCaption " + (index == this.state.viewMode ? "selected " : "") }>{roverData[0]} - {roverData[1]}</div>
         </div>
        })}
        <div className="roverPicThumbContainer">{this.renderRoverThumbnails()}</div>
      </div>
    );
  }
}

export default MainApp;