import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import MemoryIcon from '@mui/icons-material/Memory';
export default function DeviceCard() {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                {/*<CardMedia><MemoryIcon/></CardMedia>*/}
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                       <p>Device ID:</p>
                        <p>Owner:</p>
                        <p>Room:</p>
                        <p>Latest Temp:</p>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}