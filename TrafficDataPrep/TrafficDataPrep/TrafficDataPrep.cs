namespace TrafficDataPrep
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    /// <summary>
    /// Defines the <see cref="ReadFromFile" />.
    /// </summary>
    internal class ReadFromFile
    {
        /// <summary>
        /// Defines the _resource_path.
        /// </summary>
        internal static string _resource_path = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources";

        /// <summary>
        /// The Main.
        /// </summary>
        internal static void Main()
        {
            // Read the file and display it line by line.  
            var files = Directory.GetFiles(_resource_path);

            foreach (string file in files)
            {
                Console.WriteLine("Reading: " + file);
                var monthData = ReadFile(file);

                // write each entry of the map into its own file. 
                foreach (KeyValuePair<long, ArrayList> entry in monthData)
                {
                    var dataFilename = new DirectoryInfo(_resource_path).CreateSubdirectory(Path.GetFileNameWithoutExtension(file)).FullName + Path.DirectorySeparatorChar + entry.Key + ".csv";
                    Console.WriteLine(dataFilename);

                    if (File.Exists(dataFilename)) { File.Delete(dataFilename); }

                    File.WriteAllLines(dataFilename, entry.Value.Cast<string>().ToArray());
                }
            }
            Console.Read();
        }

        /// <summary>
        /// The ReadFile.
        /// </summary>
        /// <param name="filepath">The filepath<see cref="string"/>.</param>
        /// <returns>The <see cref="string[]"/>.</returns>
        internal static Dictionary<long, ArrayList> ReadFile(string filepath)
        {
            DateTime minDate = DateTime.MaxValue;
            DateTime maxDate = DateTime.MinValue;

            Dictionary<long, ArrayList> days = new Dictionary<long, ArrayList>();

            System.IO.StreamReader reader = new System.IO.StreamReader(filepath);

            string line;
            int counter = 0;
            while ((line = reader.ReadLine()) != null)
            {
                var fields = line.Split(",");
                //2019/08/13 00:55:06.934, ZoneStatistics, 1955786687, 02 Adv, 1, 0, 15,
                var date = DateTime.ParseExact(fields[0], "yyyy/MM/dd HH:mm:ss.fff", new System.Globalization.CultureInfo("en-US"));
                if (days.ContainsKey(date.Month))
                {
                    var previous = days[date.Month];
                    previous.Add(line);
                }
                else
                {
                    var list = new ArrayList();
                    list.Add(line);
                    days.Add(date.Month, list);
                }
                minDate = (date < minDate) ? date : minDate;
                maxDate = (date > maxDate) ? date : maxDate;

                counter++;
            }

            reader.Close();
            Console.WriteLine("First Day:" + minDate.ToString("yyyy / MM / dd HH: mm:ss.fff", new System.Globalization.CultureInfo("en-US")));
            Console.WriteLine("Last Day:" + maxDate.ToString("yyyy / MM / dd HH: mm:ss.fff", new System.Globalization.CultureInfo("en-US")));

            return days;
        }

        /// <summary>
        /// The Head.
        /// </summary>
        /// <param name="filepath">The filepath<see cref="string"/>.</param>
        /// <returns>The <see cref="string"/>.</returns>
        internal static string Head(string filepath)
        {
            return new System.IO.StreamReader(filepath).ReadLine();
        }
    }
}
