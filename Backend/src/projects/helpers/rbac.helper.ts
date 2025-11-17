

import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectUser } from 'src/project-users/project-user.entity';

export async function checkProjectAdminOrOwner(
  projectId: string,
  currentUser: any,
  projectUserRepo: Repository<ProjectUser>,
) {
  // Global Admin
  if (currentUser.role === 'admin') {
    return true;
  }

  // Project Owner
  const isOwner = await projectUserRepo.findOne({
    where: {
      project: { id: projectId },
      user: { id: currentUser.id },
      role: 'owner',
    },
  });

  if (!isOwner) {
    throw new ForbiddenException(
      'Only global admin or project owner can perform this action',
    );
  }

  return true;
}
