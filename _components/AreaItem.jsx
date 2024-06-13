import React from "react";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";

const AreaItem = ({
                      id,
                      areaName,
                      hardwareId,
                      ownerId,
                      thresholdMin,
                      thresholdMax,
                  }) => {
    return (
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {areaName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Hardware ID: {hardwareId}
                            Owner ID: {ownerId}
                            Threshold Min: {thresholdMin}
                            Threshold Max: {thresholdMax}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    )
}

export default AreaItem