import React, { useState, useEffect } from 'react';
import "./HospitalDetail.scss";
import { ReactBingmaps } from 'react-bingmaps';

const HospitalDetail = () => {
    const bingMapsKey = 'AjEspP0hPcm64YDxQpA3xqkrPG2f6N97S8gZUPDnJVt9pD3cadnTx-iCHb24GCxG';

    const mapOptions = {
        credentials: bingMapsKey,
        center: [40.7128, -74.0060], // Default center (New York City coordinates)
        zoom: 10, // Default zoom level
    };


    return (
        <div className='hospitalDetail-main-container bg-light_0 dark:bg-dark '>
            <div className="left"></div>
            <div className="hospitalDetail-main-inner-container text-lightProfileName dark:text-darkProfileName">


                <ReactBingmaps
                    className='bing-map-container'
                    center={mapOptions.center}
                    zoom={mapOptions.zoom}
                    bingmapKey={mapOptions.credentials}
                >
                    {/* Add any additional map components or markers here */}
                </ReactBingmaps>

            </div>
        </div>
    )
}

export default HospitalDetail