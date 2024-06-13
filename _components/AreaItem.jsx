"use client"
import React, { useEffect } from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useRouter } from 'next/router';
import Link from "next/link";

const AreaItem = ({
                      id,
                      areaName,
                      hardwareId,
                      ownerId,
                      thresholdMin,
                      thresholdMax,
                  }) => {
    // const router     = useRouter();

    // const handleClick = () => {
    //     router.push(`/area/${id}`);
    // };

    // useEffect(() => {
    //     // This ensures that the router is only accessed on the client side
    // }, []);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <Link href={(`/area/${id}`)}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {areaName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        AreaId: {id}
                        Hardware ID: {hardwareId}
                        <br />
                        Owner ID: {ownerId}
                        <br />
                        Threshold Min: {thresholdMin}
                        <br />
                        Threshold Max: {thresholdMax}
                    </Typography>
                </CardContent>
            </Link>
        </Card>
    );
};

export default AreaItem;
