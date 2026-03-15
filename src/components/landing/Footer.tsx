import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61586587216148",
      label: "Facebook",
    },
    {
      icon: Twitter,
      href: "https://www.threads.com/@nailify.diaries?igshid=NTc4MTIwNjQ2YQ==",
      label: "Thread",
    },
    { icon: Mail, href: "togetherlms@gmail.com", label: "Email" },
  ];

  return (
    <footer className="text-slate-500 font-bold pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <h2
              className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent mb-4"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #950101, #D81B60, #FFCFE9)",
              }}
            >
              Nailify
            </h2>
            <p className="text-sm leading-relaxed">
              Nâng tầm trải nghiệm làm đẹp của bạn với công nghệ đặt lịch và
              quản lý thông minh nhất.
            </p>
          </div>

          {/* Links: About Us */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D81B60] mb-6">
              Về Nailify
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="hover:text-[#D81B60] transition-colors">
                  Câu chuyện thương hiệu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D81B60] transition-colors">
                  Đội ngũ Codix
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D81B60] transition-colors">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D81B60] mb-6">
              Hỗ trợ
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="hover:text-[#D81B60] transition-colors">
                  Dành cho chủ tiệm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D81B60] transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D81B60] transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D81B60] mb-6">
              Kết nối
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#D81B60] border border-[#D81B60] hover:bg-[#D81B60] transition-all duration-300 hover:text-white"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-[10px] font-medium tracking-widest uppercase">
            © 2026 Codix Project - Giảng viên: Thầy Huy (huyntl2)
          </p>
          <div className="flex gap-6">
            <span className="text-[10px]  uppercase tracking-widest">
              Thiết kết bởi Phan Đỗ Gia Tuệ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
