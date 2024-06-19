"use client"// app/area/[id]/page.js

import { useParams } from 'next/navigation';
import {useEffect, useState} from "react";
import axios from "axios";
import Viewers from "/_components/Viewers"

const AreaPage = () => {
    const [area, setArea] = useState([]);

    useEffect(() => {


        if (id && area.length === 0 ) {
            console.log(area)
            axios({
                method: 'get',
                baseURL: 'http://localhost:8080/area/getArea',
                params: {
                    areaId:id
                },
                responseType: 'json',
            })
                .then(response => {
                    // handle success
                    console.log(response.data);
                    setArea(response.data);
                })
                .catch(error => {
                    // handle error
                    console.error("Caught Error",error);
                });
        }
    });
    const params = useParams();
    const { id } = params;
    console.log("Area ID in page.js:",id)
    if(area.length !== 0 && id){
        return (
            <div>
                <h1>{area.areaName}</h1>
                {/*<h2>{area.viewers[0]}</h2>*/}
                {/*<h2>Area info: {area}</h2>*/}
                <Viewers viewers={area.viewers} areaId={id}></Viewers>
            </div>
        );
    }
};

export default AreaPage;
