import axios from "axios";
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular';
const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) {
    throw new Error("API Key no encontrada. Verifica tu archivo .env.");
} else {
    console.log("The Movie Database: API Key detectada");
}

export const getMovies = async (req: Request, res: Response): Promise<Response | any> => {
    const page = req.query.page || 1; // Número de página recibido del front, por defecto 1
  
    try {
        const response = await axios.get(TMDB_API_URL, {
            params: {
                api_key: apiKey,
                language: 'es-ES',
                page
            }
        });
        
        const peliculas = response.data.results;
        return res.json({ peliculas, page: response.data.page, total_pages: response.data.total_pages });
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        return res.status(500).json({ message: 'Error al obtener las películas' });
    }
};


export const getMoviesByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const { category } = req.params;  // Recibe la categoría como parámetro de URL
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${category}`, {
            params: {
                api_key: apiKey,
                language: 'es-ES',
                page: 1,
            },
        });
        return res.status(200).json({
            message: `Películas de la categoría: ${category}`,
            data: response.data.results,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener películas por categoría",
        });
    }
};

export const searchMovies = async (req: Request, res: Response): Promise<Response | any> => {
    const { query } = req.query; // Se recibe el término de búsqueda como parámetro de consulta
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Se requiere un término de búsqueda válido.' });
    }

    try {
        // Realizamos la búsqueda en TMDB usando el endpoint de búsqueda de películas
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: apiKey,
                language: 'es-ES',
                query,
                page: 1,
            }
        });

        // Enviamos los resultados al frontend
        return res.status(200).json({
            success: true,
            data: response.data.results,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results,
        });
    } catch (error) {
        console.error("Error al buscar películas:", error);
        return res.status(500).json({ message: 'Error al buscar películas' });
    }
};

export const detailsMovie = async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;

    try {
        // Hacer la solicitud a TMDB para obtener los detalles de la película por ID usando el endpoint correcto
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: {
                api_key: apiKey,
                language: 'es-ES' // Ajusta el idioma según tus necesidades
            }
        });

        const movieDetails = response.data;

        // Enviar los detalles de la película al frontend
        return res.status(200).json({ data: movieDetails });
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
        return res.status(500).json({ message: 'Error al obtener los detalles de la película' });
    }
};