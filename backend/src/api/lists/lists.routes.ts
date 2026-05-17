import { Router, type RequestHandler } from 'express';
import { prisma } from '../../config/db.js';

export const listsRouter = Router();

// Herkese açık popüler listeler. Beğeni sayısına göre sıralanır.
const popularHandler: RequestHandler = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 10), 50);
    const lists = await prisma.list.findMany({
      where: { visibility: 'PUBLIC' },
      orderBy: [{ likes: { _count: 'desc' } }, { createdAt: 'desc' }],
      take: limit,
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        _count: { select: { likes: true, items: true } },
        items: {
          orderBy: { position: 'asc' },
          take: 4,
          select: {
            content: { select: { id: true, posterPath: true, title: true } },
          },
        },
      },
    });

    res.json(
      lists.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        type: l.type,
        coverImage: l.coverImage,
        createdAt: l.createdAt,
        user: l.user,
        likeCount: l._count.likes,
        itemCount: l._count.items,
        previewPosters: l.items
          .map((it) => it.content.posterPath)
          .filter((p): p is string => Boolean(p)),
      })),
    );
  } catch (err) {
    next(err);
  }
};

listsRouter.get('/popular', popularHandler);
