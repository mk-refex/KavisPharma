import { useEffect, useState } from 'react';
import { getAboutContent, resolveImageUrl, type TeamMember } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

export default function TeamSection() {
  const [team, setTeam] = useState(defaultAboutContent.team);
  const [members, setMembers] = useState<TeamMember[]>(
    defaultAboutContent.team.members,
  );

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.team) {
          setTeam(data.team);
          if (data.team.members?.length) {
            setMembers(data.team.members);
          }
        }
      })
      .catch(() => {
        // Keep default content if API is unavailable
      });
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-4">
            {team.title}
          </h2>
          <p className="text-sm md:text-base text-foreground-700 leading-relaxed whitespace-pre-line">
            {team.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-36 h-36 md:w-44 md:h-44 mb-5 overflow-hidden rounded-full">
                <img
                  src={resolveImageUrl(member.image)}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-lg md:text-xl font-semibold text-primary-500 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-accent-500 mb-4">{member.role}</p>
              <p className="text-sm text-foreground-700 leading-relaxed max-w-md">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
