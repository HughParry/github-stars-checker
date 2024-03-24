import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

interface StarCardProps {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  starredAt: string;
}

export const StarCard: React.FC<StarCardProps> = ({
  login,
  avatarUrl,
  htmlUrl,
  starredAt,
}) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia component="img" height="140" image={avatarUrl} alt={login} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {login}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Starred on: {new Date(starredAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={htmlUrl} target="_blank">
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};
