import React,{Component} from 'react';
import styles from './Corousel.module.css';
import {serverURI} from '../../APIs/APIEndpoints';

class Corousel extends Component{
    state = {
        idx: 0
    }

    prev = () => {
        const idx = this.state.idx - 1;
        if(idx >= 0)
            this.setState({idx: idx});
    }

    next = () => {
        const idx = this.state.idx + 1;
        if(idx < this.props.image.length)
            this.setState({idx: idx});
    }

    render(){
    const images=this.props.image;
        return(
            <div className={styles.carouselContainer}>
                <div className={styles.imageContainer}>
                    <img src={serverURI+"/"+ images[this.state.idx]} alt={images[this.state.idx]}/>
                </div>
                {(images.length>1)?
                <div><button className={[styles.arrow,styles.prev].join(' ')} onClick={this.prev}><i className="fa fa-angle-left"/></button>
                <button className={[styles.arrow,styles.next].join(' ')} onClick={this.next}><i className="fa fa-angle-right"/></button></div>
                :null
                }
            </div>
        );
    }
}
export default Corousel;