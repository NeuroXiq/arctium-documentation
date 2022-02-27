using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace arctium_website.Views
{
    public static class HtmlHelpers
    {
        public static IHtmlContent SvgIcon(this IHtmlHelper helper, string iconName)
        {
            var knowIcons = new string[] { "search" };
            var iconPath = Path.Combine(Startup.WebRootPath, "svg-icons", $"{iconName}.svg");

            if (!knowIcons.Any(icon => icon == iconName))
            {
                throw new ArgumentException("Unknow svg icon name");
            }

            var iconHtml = File.ReadAllText(iconPath);
            var svgIcon = new TagBuilder("div");
            svgIcon.AddCssClass("icon");
            svgIcon.AddCssClass("icon-svg");

            svgIcon.InnerHtml.AppendHtml(iconHtml);


            return svgIcon;
        }
    }
}
