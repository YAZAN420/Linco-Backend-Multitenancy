import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { RoadmapResponse } from './interfaces/roadmap.interface';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async generateRoadmap(sectionTitle: string): Promise<RoadmapResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
      });

      const roadmapSchema: Schema = {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING },
          prerequisites: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          careerOutcomes: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          steps: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                week: { type: SchemaType.INTEGER },
                topic: { type: SchemaType.STRING },
                goal: { type: SchemaType.STRING },
                skills: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
                projects: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
                deliverables: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
                resources: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
              },
              required: [
                'week',
                'topic',
                'goal',
                'skills',
                'projects',
                'deliverables',
                'resources',
              ],
            },
          },
        },
        required: [
          'title',
          'description',
          'duration',
          'difficulty',
          'prerequisites',
          'careerOutcomes',
          'steps',
        ],
      };

      const prompt = `
Generate a professional, practical, and well-structured learning roadmap for the following topic: "${sectionTitle}".

Key Requirements:
1. Duration: Choose an appropriate length between 6 and 24 weeks based on the topic's complexity.
2. Content Focus: Include only real-world, industry-standard skills. Avoid purely theoretical concepts or outdated tools.
3. Progression: Ensure each week builds logically on the previous ones, from fundamentals to advanced.
4. Practicality: Every week must include actionable skills, realistic mini-projects, and clear deliverables.
5. Language: All generated text MUST be in English.

Output strictly as a JSON object that matches the provided schema. Do not include any explanations, markdown formats, or intro text.
      `;

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: roadmapSchema,
          temperature: 0.1,
          topP: 0.8,
          topK: 20,
        },
      });

      const rawJson = result.response.text();

      if (!rawJson) {
        console.log(rawJson);
        throw new InternalServerErrorException(
          'errors.AI_CANT_GENERATE_THE_ROADMAP_PLEASE_TRY_AGAIN_LATER',
        );
      }

      return JSON.parse(rawJson) as RoadmapResponse;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message:
          'errors.AI_CANT_GENERATE_THE_ROADMAP_PLEASE_TRY_AGAIN_LATER_ERROR_ERROR',
        args: { error: String(error) },
      });
    }
  }
}
