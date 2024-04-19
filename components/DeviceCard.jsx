import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import MemoryIcon from '@mui/icons-material/Memory';

const DeviceCard = ({
                DeviceId,
                Owner,
                Room,
                LatestTemp
                    }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                {/*<CardMedia><MemoryIcon/></CardMedia>*/}
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                       <p>Device ID: {DeviceId}</p>
                        <p>Owner: {Owner}</p>
                        <p>Room:{Room}</p>
                        <p>Latest Temp:{LatestTemp}</p>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default DeviceCard